import React, { useMemo } from 'react';

interface CalendarStripProps {
    selectedDate: Date;
    onSelectDate: (date: Date) => void;
}

export const CalendarStrip: React.FC<CalendarStripProps> = ({ selectedDate, onSelectDate }) => {
    const { days, dates, fullDates } = useMemo(() => {
        const daysArr = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        const datesArr = [];
        const fullDatesArr: Date[] = [];

        // Generate dates for the week containing selectedDate (Sun-Sat)
        const date = new Date(selectedDate);
        const dayOfWeek = date.getDay(); // 0 is Sunday

        const sunday = new Date(date);
        sunday.setDate(date.getDate() - dayOfWeek);

        for (let i = 0; i < 7; i++) {
            const d = new Date(sunday);
            d.setDate(sunday.getDate() + i);
            datesArr.push(d.getDate());
            fullDatesArr.push(new Date(d));
        }

        return { days: daysArr, dates: datesArr, fullDates: fullDatesArr };
    }, [selectedDate]);

    const isSameDate = (d1: Date, d2: Date) => {
        return d1.getDate() === d2.getDate() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getFullYear() === d2.getFullYear();
    };

    return (
        <div className="flex justify-between items-center mb-6 pt-4 border-t border-gray-100">
            {days.map((day, idx) => {
                const dateObj = fullDates[idx];
                const isActive = isSameDate(dateObj, selectedDate);

                return (
                    <div
                        key={idx}
                        onClick={() => onSelectDate(dateObj)}
                        className="flex flex-col items-center gap-1 group cursor-pointer"
                    >
                        <span className="text-xs text-gray-400 font-medium">{day}</span>
                        <div className="relative">
                            <span
                                className={`text-sm font-bold ${isActive ? 'text-black' : 'text-gray-400'
                                    }`}
                            >
                                {dates[idx]}
                            </span>
                            {isActive && (
                                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-black rounded-full" />
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
