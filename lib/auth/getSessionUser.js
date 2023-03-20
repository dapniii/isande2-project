import { useEffect } from "react";
import Router from "next/router";
import useSWR from "swr";

export default async function getSessionUser({redirectTo}) {
  let user = useSWR("/api/auth/getUser");

  useEffect(() => {
    // if no redirect needed, just return (example: already on /dashboard)
    // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
    console.log(user)
    if (redirectTo == null || !user) return;
    
    // If redirectTo is set, redirect if the user was not found.
    if (redirectTo && user == null) {
      Router.push(redirectTo);
    }
  }, [user, redirectTo]);

  return { user };
}