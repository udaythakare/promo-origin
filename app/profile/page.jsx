import Link from 'next/link'
import React from 'react'

const page = () => {
    return (
        <div>
            thsi is users page
            <Link href="/vendor/dashboard">vendor dashboard</Link>
        </div>
    )
}

export default page
