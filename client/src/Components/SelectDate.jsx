import dayjs from 'dayjs'
import { Calendar } from 'lucide-react';
import React from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';

const SelectDate = ({ dateTime, id }) => {
    const [selectedDate, setSelectedDate] = React.useState(null);
    const navigate = useNavigate();

    const handleDateSelect = (date) => {
        if(!selectedDate) {
            toast.error("Please select a date first");
            return;
        }
        navigate(`/movies/${id}/${selectedDate}`);
    }
    return (
        <div className="px-6 md:px-16 lg:px-36 py-5 w-full">
            <div className="bg-black/20 backdrop-blur-md px-8 py-12 rounded-xl flex flex-col gap-4">
                <h1 className="text-lg font-semibold mb-2 flex items-center gap-2">Choose your perfect day for the show <Calendar /></h1>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {Object.keys(dateTime).map((date) => (
                            <button
                                key={date}
                                onClick={() => setSelectedDate(date)}
                                className={`border-2 px-2 py-2 rounded-md hover:scale-102 cursor-pointer ${selectedDate === date ? 'bg-accent border-accent text-primary' : 'border-primary '}`}
                            >
                                {dayjs(date).format("D MMMM")}
                            </button>
                        ))}
                    </div>
                    <div>
                        <button onClick={() => handleDateSelect(selectedDate)} className="bg-accent text-primary px-4 py-2 rounded-md hover:scale-102 cursor-pointer">
                            Confirm Date
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SelectDate
