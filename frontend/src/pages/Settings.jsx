import React,{useState} from 'react'

const Settings = () =>
  {
    const [name,setName] = useState("John","Doe");
    const [newName, setNewName] =useState(name);
    const [password,setPassword] = useState("");
    const[newPassword,SetNewPassword] = useState("");

    const handleNameChange = (e) =>
      {
        e.preventDefault();
      };
    const handlePasswordCHange = (e) =>
    {
      e.preventDefault();
      if(password !== newPassword)
      {
        alert("password does not match");
      }
      setPassword("");
      SetNewPassword("");

    };

    const handleDeleteAccount =(e) =>
    {
      const check = window.confirm("Do you want to deactivate your account");
      if(check)
      {
        alert("Account deleted");
      }
    };
    return(
      <div className='min-h-screen bg-[#0F1924]'>

      </div>
    );
  }

export default Settings