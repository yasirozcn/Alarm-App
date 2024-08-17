/* eslint-disable no-unused-vars */
import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase'; // Firebase yapılandırmanızı içe aktarın

function Navbar() {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Kullanıcı başarılı bir şekilde çıkış yaptıktan sonra yönlendirme veya işlem yapabilirsiniz
      window.location.href = '/login'; // Çıkış yapıldıktan sonra kullanıcıyı giriş sayfasına yönlendirir
    } catch (error) {
      console.error('Çıkış yaparken hata oluştu:', error);
    }
  };

  return (
    <div className="flex justify-between p-4">
      <div>LOGO</div>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        LogOut
      </button>
    </div>
  );
}

export default Navbar;
