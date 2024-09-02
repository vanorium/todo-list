import { useState, useRef } from 'react'

const savetask = JSON.parse(localStorage.getItem('tasks'))

export default () => {
  const [tasks, setTasks] = useState(savetask?.tasks || [])
  const [inputValue, setInputValue] = useState('')
  
  const newId = useRef(savetask?.newId || 0)

  const handleInputChange = (event) => setInputValue(event.target.value)

  const addItem = () => {
    if(inputValue.trim() !== '') {
      setTasks((prev) => {
        const updated = [...prev, {text:inputValue, id:newId.current, active:1}]
        localStorage.setItem('tasks', JSON.stringify({tasks: [...updated], newId:newId.current}));
        return updated
      })
      newId.current++;
      setInputValue('');
    }
  }
  

  const removeTask = (id) => {
    setTasks(actualTasks => {
      const updated = actualTasks.filter(task => task.id!=id)
      localStorage.setItem('tasks', JSON.stringify({tasks:updated, newId:newId.current}));
      return updated
    })
  }

  const Block = ({ task }) => {
    const [active, setActive] = useState(task.active)

    const handleToggle = () => {
      setActive(prevActive => {
        const newActive = prevActive*-1
        const updated = {...task, active: newActive}
        const updatedTasks = tasks.map(task => task.id==updated.id ? updated : task)
        localStorage.setItem('tasks', JSON.stringify({tasks:updatedTasks, newId:newId.current}));
        task.active=newActive
        return newActive
      })
    }

    return (
      <div onClick={handleToggle} className='block'>
        <div style={{color:`hsl(${(task.id * 32) % 360}, 100%, 50%)`}} className={`note ${active==-1 ? 'inactive' : ''}`}>{task.text}</div>
        <button onClick={() => removeTask(task.id)}>🧨</button>
      </div>
    )
  }

  return (
    <>
      <h1>Todo list</h1>
      <div className="container">
        <div className="input-container">
          <input onChange={handleInputChange} value={inputValue} placeholder="Do..." type="text" />
          <button onClick={addItem}>📌</button>
        </div>
        {tasks.map(task => <Block key={task.id} task={task}></Block>)}
      </div>
    </>
  )
}