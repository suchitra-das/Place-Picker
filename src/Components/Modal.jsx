import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

function Modal({ open, children }) {
  const dialog = useRef();
//  dialog.current.showModal()

useEffect(()=>{
  if(open){
   dialog.current.showModal()

  }else{
    dialog.current.close()
}
},[open])
 
 return createPortal(
    <dialog className="modal" ref={dialog}>
      {open ? children: null}
    </dialog>,
    document.getElementById('modal')
  );
};

export default Modal;