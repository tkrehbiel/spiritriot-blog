import { useState } from 'react';

interface FilterFormProps {
    onSubmit: (filterValue: string) => void;
}

// Client side form to query the api for entries
const FilterForm: React.FC<FilterFormProps> = ({ onSubmit }) => {
    const [filterValue, setFilterValue] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: how do I display "searching..." on the client???
        try {
            const response = await fetch(
                `/api/query?source=movies&text=${filterValue}`,
            );
            const data = await response.json();
            onSubmit(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Filter data..."
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
            />
            <button type="submit">Apply Filter</button>
        </form>
    );
};

export default FilterForm;
