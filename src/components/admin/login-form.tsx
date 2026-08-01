"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowRight, LoaderCircle, LockKeyhole, Mail } from "lucide-react";
import { loginAction, type LoginState } from "@/app/masuk/actions";

const initialState: LoginState = { error: "" };

export function LoginForm() {
  const [state, action] = useActionState(loginAction, initialState);
  return <form action={action} className="login-form"><label><span>Email pengurus</span><div><Mail size={17} /><input name="email" type="email" autoComplete="username" placeholder="nama@ubharajaya.ac.id" required /></div></label><label><span>Kata sandi</span><div><LockKeyhole size={17} /><input name="password" type="password" autoComplete="current-password" placeholder="••••••••••••" required /></div></label>{state.error && <p className="login-error" role="alert">{state.error}</p>}<LoginButton /></form>;
}

function LoginButton() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending}>{pending ? <LoaderCircle className="spin" size={18} /> : <ArrowRight size={18} />}{pending ? "Memeriksa…" : "Masuk ke panel"}</button>;
}
