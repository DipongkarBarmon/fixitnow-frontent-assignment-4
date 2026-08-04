"use server"


import { cookies } from "next/headers";



type loginActionState = {
  email: string,
  password: string,

}



export const loginAction = async (formData: loginActionState) => {

  const { email, password } = formData;

  console.log(email, password);

  const payload = {
    email,
    password
  }


  const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })

  const result = await res.json()

  if (result.success) {
    const cookieStore = await cookies()

    cookieStore.set("accessToken", result.data?.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24, //7 days 

    })

    cookieStore.set("refreshToken", result.data?.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, //7 days 

    })

    //  redirect("/dashboard","replace")
  }

  return result

}   