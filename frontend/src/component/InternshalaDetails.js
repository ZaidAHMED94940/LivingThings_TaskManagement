import React, { useState ,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function InternshalaDetails() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [educationData,setEducationData]=useState({})
  const emailid=localStorage.getItem('email')
  useEffect(() => {
    const fetchEducationData = async () => {
      if (!emailid) {
        console.error("No email found in localStorage.");
        return;
      }
  
      try {
        const response = await axios.post('http://localhost:5000/api/education/email', {
          email: emailid  // Send the email in the request body
        });
  
        // Check if the response data is already an array; if not, convert it to an array
        const educationArray = Array.isArray(response.data) ? response.data : [response.data];
  
        // Update state with the array of education data
        setEducationData(educationArray);
        console.log(educationArray);  // Log the array structure for verification
  
      } catch (error) {
        console.error('Error fetching education data:', error);
      }
    };
  
    // Fetch data when the email is available
    fetchEducationData();
  }, [emailid]); // Assuming 'emailid' is what triggers the fetch
   // Assuming 'emailid' is what triggers the fetch
  
  const handleInternshalaDetails = async (event) => {
    event.preventDefault();
    setError('');
    axios({
      method:"POST",
      url:"http://localhost:5000/api/automation/run-internshala",
      data:{
        email:email,
        password:password,
        dataFile1:educationData
      }
    }).then(res=>{
        console.log("Succesfully",res.data)
    })  .catch(error => {
      // Display the error message in the alert
      if (error.response) {
        // Server responded with a status code outside of the 2xx range
        alert(`Error: ${error.response.data.message || error.response.data}`);
      } else if (error.request) {
        // Request was made, but no response was received
        alert("No response received from the server.");
      } else {
        // Some other error occurred while setting up the request
        alert(`Error: ${error.message}`);
      }
  
      console.log("Error in Form Submission", error);
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  return (
    <div className='bg-secondary min-h-screen flex items-center justify-center'>
      <div className='bg-white p-8 rounded-lg shadow-lg max-w-md w-full sm:w-96'>
        <h1 className='text-3xl text-center mb-8'>Enter Internshala Details</h1>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        <form className='space-y-4' onSubmit={handleInternshalaDetails}>
          <div>
            <input
              type='text'
              id='email'
              name='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              placeholder='Enter your Internshala Email'
              required
            />
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id='password'
              name='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              placeholder='Enter your Internshala password'
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>
          <div className='flex justify-center'>
            <button
              type='submit'
              className='py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InternshalaDetails;