import "./styles.css";
import {Button} from "antd";
import {useNavigate,useParams} from "react-router-dom";
import {useEffect,useState} from "react";
import FormComponent from "../../components/FormComponent/FormComponent";
export default function Editpage() {
    const { id } = useParams();
    const [jobitem, setJobitem] = useState({});
    const joblist = localStorage.getItem("joblist") ? JSON.parse(localStorage.getItem("joblist")) : [];
    const navigate = useNavigate();
    const handleSubmit = (values) => {
        const updatedJob = {
            ...jobitem,
            jobTitle: values.jobTitle,
            updatedAt: new Date().toISOString(),
        };

        setJobitem(updatedJob);

        const newJobList = joblist.map((item) =>
            item.id === updatedJob.id ? updatedJob : item
        );
        newJobList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        localStorage.setItem("joblist", JSON.stringify(newJobList));
        navigate("/");
    }
    useEffect(() => {
        if (id) {
            const item = joblist.find((item) => parseInt(item.id) === parseInt(id));
            setJobitem(item);
        }
    }, [id]);
    return (
        <div className="Editpage-wapper">
            <div className="Editpage-title">
                <h1>Edit Job</h1>
                <Button color="cyan" variant="solid" size="large" onClick={() => navigate("/")}>
                    Back
                </Button>
            </div>
            <div className="Editpage-content">
                <FormComponent onClick={handleSubmit} initialValues={{
                    jobTitle: jobitem.jobTitle || "",
                }} />
            </div>
        </div>
    )
}