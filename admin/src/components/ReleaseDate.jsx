
import { useState } from "react";
import { NumberInput } from '@mantine/core';
import { Select } from '@mantine/core';

function ReleaseDate({ rdate }) {

    const [date, setDate] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');

    return (
        <div className="mt-5">
            <h2 className="text-xl mt-2">Release Date</h2>

            <div className="flex items-center gap-4">
                

                <NumberInput
                    label=""
                    placeholder="Date"
                    value={date ? date : rdate.date}
                    onChange={ev => setDate(ev.target.value)}
                    min={1}
                    max={31}
                    styles={{
                        dropdown: { maxHeight: 200, overflowY: 'auto', borderRadius: '7px' },
                        wrapper: {
                            borderRadius: '10px'
                        },
                        input: {
                            fontSize: '16px',
                            padding: '22px 13px',
                            borderRadius: '7px',
                            cursor: 'pointer'
                        },
                        option: {
                            fontSize: '16px',
                            padding: '8px 15px',
                            borderRadius: '5px'
                        },
                    }} />

                <Select
                    placeholder="Month"
                    searchable
                    value={month}
                    onChange={ev => setMonth(ev)}
                    styles={{
                        dropdown: { maxHeight: 200, overflowY: 'auto', borderRadius: '7px' },
                        wrapper: {
                            borderRadius: '10px',
                            marginBottom: '16px'
                        },
                        input: {
                            fontSize: '16px',
                            padding: '22px 13px',
                            borderRadius: '7px',
                            cursor: 'pointer'
                        },
                        option: {
                            fontSize: '16px',
                            padding: '8px 15px',
                            borderRadius: '5px'
                        },
                    }}
                    mt="md"
                    data={['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']} />
                <NumberInput
                    label=""
                    placeholder="Year"
                    value={year}
                    onChange={ev => setYear(ev.target.value)}
                    min={2000}
                    max={2030}
                    styles={{
                        dropdown: { maxHeight: 200, overflowY: 'auto', borderRadius: '7px' },
                        wrapper: {
                            borderRadius: '10px'
                        },
                        input: {
                            fontSize: '16px',
                            padding: '22px 13px',
                            borderRadius: '7px',
                            cursor: 'pointer'
                        },
                        option: {
                            fontSize: '16px',
                            padding: '8px 15px',
                            borderRadius: '5px'
                        },
                    }} />

            </div>
        </div>
    );
}