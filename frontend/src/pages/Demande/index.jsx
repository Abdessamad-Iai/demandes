// import { useAuthContext } from "../../contexts/authContext";
import AdminDemandes from "./administrateur"
import Stagiaire from "./stagiaire/index"

const index = () => {
    // const {user} = useAuthContext()
    const user = {
        role:"stagiaire"
    }
  return (
    <>
        {user.role === "administratuer" && (<AdminDemandes/>)}
        {user.role === "stagiaire" && (<Stagiaire />)}
    </>
  )
}

export default index