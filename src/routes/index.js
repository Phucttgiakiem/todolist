import Homepage from "../pages/Homepage/Homepage";
import Createpage from "../pages/Createpage/Createpage";
import Editpage from "../pages/Editpage/Editpage";
export const routes = [
    {
        path: "/",
        page: Homepage,
    },
    {
        path: "/create",
        page: Createpage,
    },
    {
        path: "/edit/:id",
        page: Editpage,
    }
]
