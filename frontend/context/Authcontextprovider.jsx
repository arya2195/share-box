import React from 'react'
import Authcontext from './Authcontext'
import { useEffect,useState } from 'react'


function Authcontextprovider({children}) {
    const[user,setuser]=useState({});
    const fetchuser=async()=>{
        try{
        const res=await fetch('http://localhost:3000/api/user/me',{
            method:'GET',
            credentials:'include'
        })
        if(!res.ok){
            const data=await res.json();
            console.log(data.msg);
        }
        else {
            const data=await res.json();
            setuser(data.user)
        }
    }
    catch(err){
        console.log(err);
    }
    }
    useEffect(()=>{
        fetchuser();
    },[])


  return (
    <Authcontext.Provider value={{user,setuser}}>
       {children}
    </Authcontext.Provider>
  )
}

export default Authcontextprovider