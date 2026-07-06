import "./styles.css";
import {Button} from "antd";
import {useNavigate} from "react-router-dom";
import FormComponent from "../../components/FormComponent/FormComponent";
export default function Createpage() {
    const navigate = useNavigate();
    const joblist = localStorage.getItem("joblist") ? JSON.parse(localStorage.getItem("joblist")) : [];
    const handleSubmit = (values) => {
        const item = {
            id: Date.now().toString(),
            jobTitle: values.jobTitle,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: "Pending",
        }
        joblist.push(item);
        joblist.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        localStorage.setItem("joblist", JSON.stringify(joblist));
        navigate("/");
    }
    return (
        <div className="Createpage-wapper">
            <div className="Createpage-title">
                <h1>Create Job</h1>
                <Button color="cyan" variant="solid" size="large" onClick={() => navigate("/")}>
                    Back
                </Button>
            </div>
            <div className="Createpage-content">
                <FormComponent onClick={handleSubmit}/>
            </div>
        </div>
    )
}