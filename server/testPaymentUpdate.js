import mongoose from 'mongoose';
import Booking from './models/Booking.js';
import dotenv from 'dotenv';

dotenv.config();

async function testPaymentUpdate() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Update the specific booking
        const bookingId = '68834d74adc0490bf67bd3f3';
        
        console.log('Updating booking:', bookingId);
        
        const updatedBooking = await Booking.findByIdAndUpdate(
            bookingId,
            { 
                isPaid: true,
                paymentLink: ""
            },
            { new: true }
        );

        if (updatedBooking) {
            console.log('✅ Booking updated successfully:');
            console.log('ID:', updatedBooking._id);
            console.log('isPaid:', updatedBooking.isPaid);
            console.log('paymentLink:', updatedBooking.paymentLink);
        } else {
            console.log('❌ Booking not found');
        }

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

testPaymentUpdate();
