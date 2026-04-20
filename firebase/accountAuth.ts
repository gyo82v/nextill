import {
  getAuth,
  sendPasswordResetEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
} from "firebase/auth";

/**
 * Send password reset email
 */
export async function resetPassword(email: string) {
  const auth = getAuth();
  if (!email) throw new Error("Missing email");
  await sendPasswordResetEmail(auth, email);
}

/**
 * Delete user account (requires password)
 */
export async function deleteAccountWithPassword(
  email: string,
  password: string
) {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user || !email) {
    throw new Error("Not authenticated");
  }

  const credential = EmailAuthProvider.credential(email, password);
  await reauthenticateWithCredential(user, credential);
  await deleteUser(user);
}