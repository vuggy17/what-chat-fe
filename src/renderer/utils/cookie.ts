import Cookies from "universal-cookie";

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();

  return undefined;
}

async function setCookie(name: string, value: string, days = 4) {
  const c = new Cookies();

  const endTime = new Date();
  endTime.setTime(endTime.getTime() + days * 24 * 60 * 60 * 1000);
  c.set(name, value, {
    expires: endTime,
  });
}

function deleteCookie(name: string) {
  console.log("cookie deleteing");
  document.cookie =
    name + "=; Expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/; domain=localhost";
}
export { getCookie, setCookie, deleteCookie };
