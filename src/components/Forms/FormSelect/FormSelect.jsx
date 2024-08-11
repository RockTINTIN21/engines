
import Form from 'react-bootstrap/Form';
function FormSelect({ label, name, options, value, onChange }){
    return (
        <Form.Group className="mb-3 d-flex w-100 styles-card bg-gray justify-content-between p-2 align-items-center">
            <Form.Label className="w-50 mb-0">{label}</Form.Label>
            <Form.Select name={name} value={value} onChange={onChange} className="w-100 pt-0 pb-0 ps-3">
                {options.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                ))}
            </Form.Select>
        </Form.Group>
    );
}
export default FormSelect;