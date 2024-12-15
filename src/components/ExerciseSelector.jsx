import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Select from 'react-select';

const ExerciseSelector = ({ selectedExercises, setSelectedExercises }) => {
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const response = await api.get('/exercises');
                setExercises(response.data);
            } catch (err) {
                setError(err.message || 'Ошибка при загрузке упражнений');
            } finally {
                setLoading(false);
            }
        };

        fetchExercises();
    }, []);

    const handleSelectChange = (selectedOptions) => {
        const selectedExercises = selectedOptions
            ? selectedOptions.map((option) => ({
                id: option.value,
                name: option.label,
            }))
            : [];

        setSelectedExercises(selectedExercises);
    };

    const exerciseOptions = exercises.map((exercise) => ({
        value: exercise.id,
        label: exercise.name,
    }));

    const styles = {
        container: (base) => ({
            ...base,
            width: '100%',
        }),
        control: (base, state) => ({
            ...base,
            padding: '5px 10px',
        }),
        option: (base, state) => ({
            ...base,
            color: 'black',
            cursor: 'pointer',
        }),
        multiValueRemove: (base, state) => ({
            ...base,
            color: 'red',
            backgroundColor: '#c2e2ff',
            ':hover': {
                backgroundColor: '#ff818d',
                color: 'white',
            },
        }),
        multiValueLabel: (base, state) => ({
            ...base,
            color: 'black',
            fontSize: '14px',
            backgroundColor: '#c2e2ff',
        })
    }

    if (loading) return <p>Загрузка списка упражнений...</p>;
    if (error) return <p>{error}</p>;

    return (
        <Select
            styles={styles}
            options={exerciseOptions}
            isMulti
            value={selectedExercises.map((exercise) => ({
                value: exercise.id,
                label: exercise.name,
            }))}
            onChange={handleSelectChange}
            placeholder="Выберите упражнения..."
        />
    );
};

export default ExerciseSelector;
