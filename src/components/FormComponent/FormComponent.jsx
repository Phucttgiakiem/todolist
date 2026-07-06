import {useEffect} from "react";
import {Form, Input, Button} from "antd";
import PropTypes from 'prop-types';

export const FormComponent = ({ onClick, initialValues }) => {
    const [form] = Form.useForm();
    const variant = Form.useWatch("variant", form);
    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue(initialValues);
        }
    }, [initialValues, form]);
    return (
        <Form 
            form={form} 
            layout="vertical"
            variant={variant || 'filled'}
            style={{ width: "100%" }}
            initialValues={{
                variant: "filled",
                ...initialValues,
            }}
            onFinish={(values) => onClick(values)}
        >
            <Form.Item 
                label="Job Title" 
                name="jobTitle" 
                style={{ fontFamily: "Arial, sans-serif",fontSize: "20px",fontWeight: 600 }} 
                rules={[
                    {   
                        required: true, 
                        message: "Please enter the job title" 
                    },
                    {
                        min: 3,
                        message: "Job title must be at least 3 characters",
                    },
                    {
                        pattern: /^[^.;:]+$/,
                        message: "The job title cannot contain '.', ';', or ':'",
                    },
                ]} 
            >
                <Input 
                    size="large" 
                    onChange={(e) => {
                        let value = e.target.value;
                        value = value.replace(/^\s+|\s{2,}/g, " ");
                        form.setFieldValue("jobTitle", value);
                    }}
                />
            </Form.Item>
            <Form.Item style={{width: "100%", display: "flex", justifyContent: "flex-start", marginTop: "3rem"}}>
                <Button type="primary" htmlType="submit" size="large">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    )
}
export default FormComponent;

FormComponent.propTypes = {
    onClick: PropTypes.func.isRequired,
    initialValues: PropTypes.object,
};