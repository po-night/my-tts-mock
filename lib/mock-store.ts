export type User = {
  id: string;
  password: string;
  remainingChars: number;
};

declare global {
  // 開発中のホットリロードでも配列をなるべく保持するため globalThis を使う。
  var __ttsMockUsers: User[] | undefined;
}

const INITIAL_USERS: User[] = [
  {
    id: "admin",
    password: "admin1234",
    remainingChars: 999999,
  },
];

const users = globalThis.__ttsMockUsers ?? structuredClone(INITIAL_USERS);

if (!globalThis.__ttsMockUsers) {
  globalThis.__ttsMockUsers = users;
}

// 拡張ポイント: ユーザ項目を増やしたい場合はこのファイルの User 型と各関数を編集する。
export function listUsers() {
  return users.map((user) => ({ ...user }));
}

export function findUser(id: string) {
  return users.find((user) => user.id === id);
}

export function createUser(id: string, password: string) {
  const existingUser = findUser(id);

  if (existingUser) {
    throw new Error("このユーザIDはすでに使用されています。");
  }

  const user = {
    id,
    password,
    remainingChars: 10000,
  };

  users.push(user);
  return { ...user };
}

export function validateUser(id: string, password: string) {
  const user = findUser(id);

  if (!user || user.password !== password) {
    return null;
  }

  return { ...user };
}

export function consumeCharacters(id: string, amount: number) {
  const user = findUser(id);

  if (!user) {
    throw new Error("ユーザが見つかりません。");
  }

  if (amount <= 0) {
    throw new Error("1文字以上入力してください。");
  }

  if (user.remainingChars < amount) {
    throw new Error("残り文字数が不足しています。");
  }

  user.remainingChars -= amount;
  return { ...user };
}

export function updatePassword(id: string, nextPassword: string) {
  const user = findUser(id);

  if (!user) {
    throw new Error("ユーザが見つかりません。");
  }

  user.password = nextPassword;
  return { ...user };
}
