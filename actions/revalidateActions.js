'use server'

import { revalidatePath } from "next/cache"
export async function revalidateMyCouponPage() {
    revalidatePath("/u/profile/my-coupons")
}