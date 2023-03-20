// Template only

import { useEffect } from "react";
import Router from "next/router";

export default async function getSessionUser() {
  let result;

  useEffect(() => {
    fetch("/api/auth/getUser", {
      method: "GET",
      headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
    })
      .then((res) => res.json())
      .then((user) => {
        
        if (!user.isLoggedIn)
          Router.replace("/login")
        else
          result = user.data
          console.log(result)
      })
    
  }, [])

  return { result };
}