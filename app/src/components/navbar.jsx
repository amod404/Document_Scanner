import Logo from '../assets/Logo.png';

const Navbar = () => {
  return (
    <div className='w-[100%] min-h-10 flex items-center justify-center p-4'>
      <img src={Logo} alt="Logo" className='h-[2rem]'/>
    </div>
  );
};

export default Navbar