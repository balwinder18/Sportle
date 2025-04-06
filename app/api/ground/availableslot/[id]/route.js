
// app/api/slots/[groundId]/route.js
import { NextResponse } from 'next/server';
import Bookings from '../../../../../database/models/BookingModel';
import Grounds from '../../../../../database/models/GroundsModel';

// function generateTimeSlots(date, operatingHours, slotDuration = 30) {
//   const slots = [];
//   const [openHour, openMinute] = operatingHours.open.split(':').map(Number);
//   const [closeHour, closeMinute] = operatingHours.close.split(':').map(Number);

//   // Create a date in IST (UTC+5:30)
//   const startTime = new Date(date);
//   startTime.setHours(openHour , openMinute , 0, 0); 

//   const endTime = new Date(date);
//   endTime.setHours(closeHour , closeMinute , 0, 0);

//   let current = new Date(startTime);
//   while (current < endTime) {
//     const slotEnd = new Date(current.getTime() + slotDuration * 60000);
//     if (slotEnd > endTime) break;

//     slots.push({
//       start: new Date(current),
//       end: new Date(slotEnd)
//     });
//     current = slotEnd;
//   }

//   return slots;
// }



// function generateTimeSlots(date, operatingHours, slotDuration = 30) {
//   const slots = [];
//   const [openHour, openMinute] = operatingHours.open.split(':').map(Number);
//   const [closeHour, closeMinute] = operatingHours.close.split(':').map(Number);

//   // 1. Create base date in IST (manually set UTC+5:30)
//   const istDate = new Date(date);
//   istDate.setUTCHours(openHour - 5, openMinute - 30, 0, 0); // Convert IST to UTC

//   // 2. Set operating hours in IST
//   const startTime = new Date(istDate);
//   startTime.setUTCHours(openHour - 5, openMinute - 30, 0, 0);

//   const endTime = new Date(istDate);
//   endTime.setUTCHours(closeHour - 5, closeMinute - 30, 0, 0);

//   // 3. Generate slots
//   let current = new Date(startTime);
//   while (current < endTime) {
//     const slotEnd = new Date(current.getTime() + slotDuration * 60000);
    
//     slots.push({
//       start: new Date(current.getTime() + (5.5 * 60 * 60 * 1000)), // Convert back to IST
//       end: new Date(slotEnd.getTime() + (5.5 * 60 * 60 * 1000))   // Convert back to IST
//     });
    
//     current = slotEnd;
//   }

//   return slots;
// }




// function generateTimeSlots(date, operatingHours, slotDuration = 30) {
  
//   const slots = [];
//   const [openHour, openMinute] = operatingHours.open.split(':').map(Number);
//   const [closeHour, closeMinute] = operatingHours.close.split(':').map(Number);

//   // Use UTC for all calculations
//   const startTime = new Date(date);
//   startTime.setUTCHours(openHour, openMinute, 0, 0);

//   const endTime = new Date(date);
//   endTime.setUTCHours(closeHour, closeMinute, 0, 0);

//   let current = new Date(startTime);
//   while (current < endTime) {
//     const slotEnd = new Date(current.getTime() + slotDuration * 60000);
//     if (slotEnd > endTime) break;

//     slots.push({
//       start: new Date(current).toISOString(), // UTC
//       end: new Date(slotEnd).toISOString()    // UTC
//     });
//     current = slotEnd;
//   }

//   return slots;
// }


function generateTimeSlots(operatingHours, slotDuration = 30) {
  const slots = [];
  const [openHour, openMinute] = operatingHours.open.split(':').map(Number);
  const [closeHour, closeMinute] = operatingHours.close.split(':').map(Number);

  // Create a reference date (today at midnight UTC)
  const refDate = new Date();
  refDate.setUTCHours(0, 0, 0, 0);

  // Set operating hours (UTC)
  const startTime = new Date(refDate);
  startTime.setUTCHours(openHour, openMinute, 0, 0);

  const endTime = new Date(refDate);
  endTime.setUTCHours(closeHour, closeMinute, 0, 0);

  let current = new Date(startTime);
  while (current < endTime) {
    const slotEnd = new Date(current.getTime() + slotDuration * 60000);
    if (slotEnd > endTime) break;

    // Extract only time portion (HH:MM:SS)
    const startTimeStr = current.toISOString().split('T')[1].split('.')[0];
    const endTimeStr = slotEnd.toISOString().split('T')[1].split('.')[0];

    slots.push({
      start: startTimeStr, // e.g. "09:00:00"
      end: endTimeStr      // e.g. "09:30:00"
    });
    
    current = slotEnd;
  }

  return slots;
}

export async function GET(request, { params }) {
  const { id } = params;
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  // const timezone = searchParams.get('timezone'); Not used currently but could be for timezone adjustments

  if (!date) {
    return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 });
  }

  try {
    const ground = await Grounds.findById(id);
    if (!ground) return NextResponse.json({ error: 'Ground not found' }, { status: 404 });

    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
    }

    const allSlots = generateTimeSlots( ground.operatingHours);
  
    
    const bookedSlots = await Bookings.find({
      groundId: id,
      startTime: { $lt: allSlots[allSlots.length - 1].end },
      endTime: { $gt: allSlots[0].start },
      status: 'booked'
    });

    const availableSlots = await Promise.all(
      allSlots.map(async (slot) => {
        const isBooked = await Bookings.exists({
          groundId: id,
          status: 'booked',
          startTime: { $lt: slot.end },
          endTime: { $gt: slot.start },
          bookingdate:date
        });
    
        // Convert UTC to IST for display
        // const formatIST = (utcDate) => {
        //   return new Date(utcDate).toLocaleTimeString('en-IN', {
        //     timeZone: 'Asia/Kolkata',
        //     hour12: false,
        //     hour: '2-digit',
        //     minute: '2-digit'
        //   });
        // };
    
        return {
          start: slot.start, // "16:30" IST
          end: slot.end,     // "17:00" IST
          available: !isBooked
        };
      })
    );
    
    
    return NextResponse.json(availableSlots);
  } catch (error) {
    console.error('Error fetching slots:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}




