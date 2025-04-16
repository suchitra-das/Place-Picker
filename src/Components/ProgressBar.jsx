
import { useState,useEffect } from "react";

export default function ProgressBar({timer}){
     const [remainingTime, setRemainingTime] = useState(timer);

     useEffect(() => {
         console.log('INTERVAL');
         const interval = setInterval(()=>{
           setRemainingTime(preTime => preTime - 10);
         },10)
     
         return() => {
           clearInterval(interval)
         };
     
       }, []);

       return<progress value={remainingTime} max={timer}/>

}