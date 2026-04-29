'use client';
import Locations from '@/components/Locations';
import Helpdesk from '@/components/Helpdesk';

export default function CampusPage() {
  return (
    <>
      <h1 className="text-3xl md:text-4xl font-extrabold text-navy mb-1" style={{ fontFamily: 'Outfit' }}>
        Campus &amp; Support
      </h1>
      <p className="text-gray-500 mb-6">Find buildings, rooms, and accessibility info — or submit a helpdesk ticket.</p>

      <Locations />
      <hr className="border-gray-200 my-10" />
      <Helpdesk />
    </>
  );
}
