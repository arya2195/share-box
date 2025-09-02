import React from 'react'
import Authcontext from './Authcontext'
import { useEffect,useState } from 'react'


function Authcontextprovider({children}) {
    const[user,setuser]=useState({});
    
    const fetchuser=async()=>{
        try{
        const res=await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/me`,{
            method:'GET',
            credentials:'include'
        })
        if(!res.ok){
            const data=await res.json();
            console.log(data.msg);
            setuser({});
        }
        else {
            const data=await res.json();
            setuser(data.user)
            console.log("data:",data.user);
        }
    }
    catch(err){
        console.log(err);
        setuser({});
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