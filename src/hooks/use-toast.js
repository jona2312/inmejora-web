import * as React from "react"

const TOAST_LIMIT = 1
let count = 0
const genId = () => { count = (count + 1) % Number.MAX_SAFE_INTEGER; return count.toString() }
const listeners = []
let memoryState = { toasts: [] }
const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TOAST": return { ...state, toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT) }
    case "UPDATE_TOAST": return { ...state, toasts: state.toasts.map(t => t.id === action.toast.id ? {...t,...action.toast} : t) }
    case "DISMISS_TOAST": return { ...state, toasts: state.toasts.map(t => t.id === action.toastId ? {...t,open:false} : t) }
    case "REMOVE_TOAST": return { ...state, toasts: state.toasts.filter(t => t.id !== action.toastId) }
    default: return state
  }
}
const dispatch = (action) => { memoryState = reducer(memoryState, action); listeners.forEach(l => l(memoryState)) }
const toast = (props) => {
  const id = genId()
  dispatch({ type: "ADD_TOAST", toast: { ...props, id, open: true, onOpenChange: (open) => { if (!open) dispatch({type:"DISMISS_TOAST",toastId:id}) } } })
  return { id, dismiss: () => dispatch({type:"DISMISS_TOAST",toastId:id}), update: (p) => dispatch({type:"UPDATE_TOAST",toast:{...p,id}}) }
}
const useToast = () => {
  const [state, setState] = React.useState(memoryState)
  React.useEffect(() => { listeners.push(setState); return () => { const i = listeners.indexOf(setState); if(i>-1) listeners.splice(i,1) } }, [state])
  return { ...state, toast, dismiss: (toastId) => dispatch({type:"DISMISS_TOAST",toastId}) }
}
export { useToast, toast }
