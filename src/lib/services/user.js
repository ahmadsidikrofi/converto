import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"
import { db } from "../firebase"

export async function postUserToFirestore(user, displayName = "") {
    if (!user) return

    const userRef = doc(db, "users", user.uid)

    const userSnap = await getDoc(userRef)
    if (!userSnap.exists()) {
        await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            name: displayName || user.displayName || "",
            plan: "free",
            quotaLimit: 10,
            quotaUsed: 0,
            createdAt: serverTimestamp(),
            lastSeen: serverTimestamp(),
        })
    } else {
        await setDoc(userRef, {
            name: displayName || user.displayName || userSnap.data().displayName || "",
            updatedAt: serverTimestamp(),
        }, { merge: true })
    }

    return { userSnap, userRef }
}