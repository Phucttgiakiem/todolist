import "./style.css";
import {formatDateVN} from "../../utils";
import {useEffect,useState,useMemo} from "react";
import {useNavigate,Link} from "react-router-dom";
import {Button,Table,Checkbox,Space,Modal,Flex,Spin,Input} from "antd";
import {WarningOutlined,SearchOutlined} from "@ant-design/icons";
const tabDatas = [
    {
        key: 'all',
        label: 'All',
        filter: {}
    },
    {
        key: 'Completed',
        label: 'Completed',
        filter: {
            status: 'completed'
        }
    },
    {
        key: 'Pending',
        label: 'Pending',
        filter: {
            status: 'pending'
        }
    },
]
const getColumns = (handleStatusChange, handleOpenConfirmModal) => [
    {
        title: 'Job title',
        dataIndex: 'jobTitle',
        key: 'jobTitle',
        width: 300,
    },
    {
        title: 'CreatedAt',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (text) => formatDateVN(text),
        width: 200,
        sorter: true,
    },
    {
        title: 'UpdatedAt',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        render: (text) => formatDateVN(text),
        width: 200,
        sorter: true,
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (_,record) => (
            <Checkbox checked={record.status === "Completed"} onChange={() => handleStatusChange(record.id)}>
                {record.status}
            </Checkbox>
        ),
        width: 180,
    },
    {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        render: (_,record) => (
            <Space size="middle">
                <Link style={{ color: 'blue', textDecoration: 'none',cursor: 'pointer' }} to={`/edit/${record.id}`}>Edit</Link>
                <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => handleOpenConfirmModal(record.id)}>Delete</span>
            </Space>
        )
    }
]
const Homepage = () => {
    const navigate = useNavigate();
    const [filtered,setFiltered] = useState("all");
    const [loading, setLoading] = useState(false);
    const [loadingModal, setLoadingModal] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);
    const [joblist, setJoblist] = useState({
        items: [],
        total: 0,
        limit: 2,
        page: 1,
        sorter: {
            field: null,
            order: null,
        }
    });
    const [idrecordSelected, setIdrecordSelected] = useState(null);
    const [searchValue, setSearchValue] = useState("");
    const handleStatusChange = (value) => {
        setLoading(true);
        setJoblist(prev => {
            const items = prev.items.map(item =>
                item.id === value
                    ? {
                        ...item,
                        status:
                            item.status === "Pending"
                                ? "Completed"
                                : "Pending",
                        updatedAt: new Date().toISOString(),
                    }
                    : item
            );
            localStorage.setItem("joblist", JSON.stringify(items));
            return {
                ...prev,
                items,
                total: items.length,
            };
        });
        setLoading(false);
    };
    const handleOpenConfirmModal = (ids) => {
        setIdrecordSelected(ids);
        setConfirmModal(true);
    }
    const handleRemoveJob = () => {
        const items = joblist.items.filter(
            item => item.id !== idrecordSelected
        );

        localStorage.setItem("joblist", JSON.stringify(items));

        const totalPages = Math.ceil(items.length / joblist.limit);

        setJoblist(prev => ({
            ...prev,
            items,
            total: items.length,
            page: Math.min(prev.page, totalPages || 1),
        }));
        setConfirmModal(false);
        setLoadingModal(false);
    }
    const columns = getColumns(handleStatusChange,handleOpenConfirmModal);
    const displayList = useMemo(() => {
        let list = [...joblist.items];

        if (filtered !== "all") {
            list = list.filter(item => item.status === filtered);
        }

        if (searchValue) {
            list = list.filter(item =>
                item.jobTitle
                    .toLowerCase()
                    .includes(searchValue.toLowerCase())
            );
        }

        if (joblist.sorter.field) {
            list.sort((a, b) => {
                const { field, order } = joblist.sorter;

                if (field === "createdAt" || field === "updatedAt") {
                    const result =
                        new Date(a[field]) - new Date(b[field]);

                    return order === "ascend"
                        ? result
                        : -result;
                }

                return 0;
            });
        }

        return list;
    }, [
        joblist.items,
        filtered,
        searchValue,
        joblist.sorter,
    ]);
    const pageData = useMemo(() => {
        const start = (joblist.page - 1) * joblist.limit;
        return displayList.slice(start, start + joblist.limit);
    }, [displayList, joblist.page, joblist.limit]);
    const handleTableChange = (pagination,_,sorter) => {
            setJoblist(prev => ({
                ...prev,
                page: pagination.current,
                sorter: {
                    field: sorter.field,
                    order: sorter.order,
                }
            }));
    }

    useEffect(() => {
        setLoading(true);

        const stored = JSON.parse(localStorage.getItem("joblist") ?? "[]");

        setJoblist(prev => ({
            ...prev,
            items: stored,
            total: stored.length,
        }));

        setLoading(false);
    }, []);

    return (
        <>
            <Modal
                centered
                open={confirmModal}
                closable={false}
                className="confirm-modal"
                footer={
                    !loadingModal && (<div style={{ display:'flex', justifyContent: 'center', gap: '10px' }}>
                        <Space>
                            <Button 
                                size="large" 
                                onClick={() => {setConfirmModal(false); setIdrecordSelected(null);}}>
                                    Cancel
                            </Button>
                            <Button 
                                size="large" 
                                type="primary" 
                                danger={true}
                                onClick={() => { setLoadingModal(true); handleRemoveJob()}}>
                                    Accept
                            </Button>
                        </Space>
                    </div>
                    )
                }
            >
                <Space className="modal-content" align="center">
                    {
                        !loadingModal ? (
                            <>
                                <WarningOutlined style={{ fontSize: '40px',color:"#eb2f2f" }} />
                                <p style={{ textAlign: 'center',fontSize:"20px" }}>Are you sure you want to delete this job?</p>
                            </>
                        ): (
                            <Flex gap="middle" vertical>
                                <Flex gap="middle">
                                    <Spin tip="Loading ..." size="large"><div style={{padding: 50}}></div></Spin>
                                </Flex>
                            </Flex>
                        )
                    }
                </Space>
            </Modal>
            <div className="Homepage-wapper">
                <div className="Homepage-title">
                    <h1>Welcome to the to-do list</h1>
                    <Button color="cyan" variant="solid" size="large" onClick={() => navigate("/create")}>
                        Create
                    </Button>
                </div>
                <div className="Homepage-content">
                    <div className="search-wrapper">
                        <Input
                            placeholder="Search by job title"
                            allowClear
                            size="large"
                            className="search-input"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                        <SearchOutlined className="search-icon" />
                    </div>
                    <div className="filter-content">
                        <ul className="filter-list">
                            {tabDatas.map((tab) => (
                                <li 
                                    key={tab.key} 
                                    className="filter-item" 
                                    style={filtered === tab.key ? {backgroundColor: "#2b5fff", color: "#fff"} : {}} 
                                    onClick={() => {setJoblist(prev => ({...prev, page: 1})); setFiltered(tab.key)}}>
                                    {tab.label}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="list-content">
                        <Table 
                            columns={columns}
                            loading={loading}
                            dataSource={pageData}
                            scroll={{ x: 800 }}
                            pagination={{
                                current: joblist.page,
                                pageSize: joblist.limit,
                                total: displayList.length,
                                /* onChange: (page, pageSize) => {
                                    setJoblist(prev => ({
                                        ...prev,
                                        page,
                                        limit: pageSize,
                                    }));
                                }, */
                            }}
                            onChange={handleTableChange}
                        />
                    </div>
                </div>
            </div>
        </>
        
    );
}
export default Homepage;