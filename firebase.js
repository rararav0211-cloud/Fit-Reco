// ===== Firebase の設定とデータの読み書き =====
// 各画面（script.js / workout.js / exercises.js）はここの関数だけを使う

import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js';
import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  GoogleAuthProvider,
  linkWithPopup,
  signInWithPopup,
  signInWithCredential,
  signOut,
} from 'https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  writeBatch,
} from 'https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyCj0jkN_O1mptR3b8kYlv9jiHi1EvBBWA0",
  authDomain: "project-84c55ea2-2279-46c4-991.firebaseapp.com",
  projectId: "project-84c55ea2-2279-46c4-991",
  storageBucket: "project-84c55ea2-2279-46c4-991.firebasestorage.app",
  messagingSenderId: "680114384877",
  appId: "1:680114384877:web:362238de0189c0642f41e4",
  measurementId: "G-2EKLV7FNT5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// オフラインでも読み書きできるよう、端末にもデータを保存しておく
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
});

// ===== ログイン =====

// ログイン状態が決まるまで待つ（未ログインなら匿名ログインする）
let userPromise = null;
const waitForUser = () => {
  if (!userPromise) {
    userPromise = new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          unsubscribe();
          resolve(user);
          return;
        }
        try {
          await signInAnonymously(auth); // 成功すると onAuthStateChanged がもう一度呼ばれる
        } catch (e) {
          unsubscribe();
          reject(e);
        }
      });
    });
  }
  return userPromise;
};

// 今のユーザー情報（画面のログインボタン表示に使う）
export const getCurrentUser = async () => {
  const user = await waitForUser();
  return {
    isGuest: user.isAnonymous,
    name: user.displayName || user.email || '',
  };
};

// Googleでログイン
// 匿名ユーザーなら、今までの記録をそのままGoogleアカウントに引き継ぐ
export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const user = await waitForUser();

  if (!user.isAnonymous) return;

  try {
    await linkWithPopup(user, provider);
  } catch (e) {
    // そのGoogleアカウントがすでに使われている（別の端末で登録済みなど）
    if (e.code !== 'auth/credential-already-in-use') throw e;
    const ok = confirm(
      'このGoogleアカウントにはすでに記録があります。切り替えますか？\n' +
      '（ログイン前にこの端末でつけた記録は引き継がれません）'
    );
    if (!ok) return;
    const credential = GoogleAuthProvider.credentialFromError(e);
    if (credential) {
      await signInWithCredential(auth, credential);
    } else {
      await signInWithPopup(auth, provider);
    }
  }
};

export const logout = () => signOut(auth);

// ===== データの場所 =====
// users/{uid}             … bodyWeight, customExercises
// users/{uid}/logs/{日付} … その日のワークアウト記録

const userDoc = () => doc(db, 'users', auth.currentUser.uid);
const logsCol = () => collection(db, 'users', auth.currentUser.uid, 'logs');

// ===== localStorage からの引っ越し（この端末で1回だけ） =====

const MIGRATED_KEY = 'firestoreMigrated';

const loadLocalArray = (key) => {
  try {
    const list = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(list) ? list : [];
  } catch (e) {
    return [];
  }
};

const migrateLocalData = () => {
  if (localStorage.getItem(MIGRATED_KEY) === '1') return;

  const logs = loadLocalArray('workoutLogs').filter((log) => log && log.date);
  const custom = loadLocalArray('customExercises');
  const weight = Number(localStorage.getItem('bodyWeight'));

  const profile = {};
  if (weight > 0) profile.bodyWeight = weight;
  if (custom.length > 0) profile.customExercises = custom;
  const hasProfile = Object.keys(profile).length > 0;

  // 引っ越すものがなければ終わり
  if (logs.length === 0 && !hasProfile) {
    localStorage.setItem(MIGRATED_KEY, '1');
    return;
  }

  // 1回のバッチは500件までなので、400件ずつに分ける
  const chunks = [];
  for (let i = 0; i < logs.length; i += 400) {
    chunks.push(logs.slice(i, i + 400));
  }
  if (chunks.length === 0) chunks.push([]);

  const commits = chunks.map((chunk, i) => {
    const batch = writeBatch(db);
    chunk.forEach((log) => batch.set(doc(logsCol(), log.date), log));
    if (i === 0 && hasProfile) batch.set(userDoc(), profile, { merge: true });
    return batch.commit();
  });

  // 送信が終わったら完了の印をつける（localStorage の元データは念のため残す）
  // 端末の保存領域にはすぐ反映されるので、送信完了を待たずに画面を表示してよい
  Promise.all(commits)
    .then(() => localStorage.setItem(MIGRATED_KEY, '1'))
    .catch((e) => console.error('記録の引っ越しに失敗しました', e));
};

let readyPromise = null;
const ready = () => {
  if (!readyPromise) {
    readyPromise = waitForUser().then(() => migrateLocalData());
  }
  return readyPromise;
};

// ===== 読み書き =====

// プロフィール（体重・自分で追加した種目）
export const loadProfile = async () => {
  await ready();
  const snap = await getDoc(userDoc());
  return snap.exists() ? snap.data() : {};
};

export const saveProfile = async (data) => {
  await ready();
  return setDoc(userDoc(), data, { merge: true });
};

// ワークアウト記録（全件）
export const loadLogs = async () => {
  await ready();
  const snap = await getDocs(logsCol());
  return snap.docs.map((d) => d.data());
};

// ワークアウト記録（1日分。同じ日なら上書き）
export const saveLog = async (entry) => {
  await ready();
  return setDoc(doc(logsCol(), entry.date), entry);
};