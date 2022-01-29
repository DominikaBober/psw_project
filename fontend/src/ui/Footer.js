import Cookies from 'js-cookie';
import { useState } from 'react';

export default function Footer(){
  const [currentVisits, setVisits] = useState(1);

  const getCookie = () => {
    const foundCookie = Cookies.get(`visit`);
    if (foundCookie === undefined) {
      Cookies.set(`visit`, 1);
    } else {
      Cookies.set(`visit`, Number(foundCookie) + 1);
      setVisits(Number(foundCookie) + 1);
    }
  };
  window.onload = getCookie;
  return (
    <div className="footer">
      You visited us {currentVisits} times.
    </div>
  );
};
