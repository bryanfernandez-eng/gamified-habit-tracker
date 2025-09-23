import React,{useState} from 'react'

const Settings = () =>
  {
    const [name,setName] = useState("John gitDoe");
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
        <div className='max-w-xl mx-auto space-y-10'>
            <h1 className='text-3xl font-bold text-yellow-400 mb-6 text-center'>
              Settings
            </h1>
            {/*change name*/}
            <div className='cursor-pointer border border-slate-700 text-white rounded-lg  p-4  bg-gray-800 transition-colors
            hover:border-yellow-300 hover:text-yellow-300'>
              <h2 className='text-lg font-semibold'> Display Name</h2>
            </div>

            {/*change password*/}
            <div className='cursor-pointer border border-slate-700 text-white rounded-lg  p-4  bg-gray-800 transition-colors
            hover:border-yellow-300 hover:text-yellow-300'>
              <h2 className='text-lg font-semibold'> Password</h2>
            </div>

            {/*Deactivate*/}
            <div className='cursor-pointer border border-slate-700 text-white rounded-lg  p-4  bg-gray-800 transition-colors
            hover:border-yellow-300 hover:text-yellow-300'>
              <h2 className='text-lg font-semibold'> Delete Account</h2>
            </div>
        </div>
      </div>
    );
  }

export default Settings