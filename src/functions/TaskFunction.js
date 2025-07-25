
function onSubmitHandlerNewTask(newTaskDetail)
{
    const Now =new Date();
    const ObjectKeys=Object.keys(newTaskDetail)
    let ErrorMessage;
    for( let i=0;i<ObjectKeys.length;i++)
    {
        if(newTaskDetail[ObjectKeys[i]]==="")
        {
            ErrorMessage=`${ObjectKeys[i]} is not completely filled`;
            break;
        }
        else if(new Date(newTaskDetail["DueDate"])<Now)
        {
            ErrorMessage="Due Date cannot be in Past";
            break;
        }
        else if(!(newTaskDetail["Title"].length>=5) || !(newTaskDetail["Title"].length<=20))
        {
            ErrorMessage="Title must be between 5 and 20 words";
            break;
        }
        else if(!(newTaskDetail["Description"].length>=20) || !(newTaskDetail["Description"].length<=200))
        {
            ErrorMessage="Description must be between 20 and 200 words";
            break;
        }
    }

    if(!ErrorMessage)
    {
        return "";
    }
    else
    {
        return ErrorMessage;
    }
}

const handleSetTaskInfo = (id, activeId,setTaskInfo=()=>{}) => {
  if (id === activeId)
    setTaskInfo(null);
  else
    setTaskInfo(id);
}

export {onSubmitHandlerNewTask,handleSetTaskInfo};