import React from 'react'
import EditMonitor from './EditMonitor'


const CardMonitor = (props) => {
  
  return (
    <div className='flex flex-col m:mx-0 m:mr-[10px]'>
      <EditMonitor monitorData={props.monitor} parentCallback={props.parentCallback} />
    </div>

  )
}

export default CardMonitor