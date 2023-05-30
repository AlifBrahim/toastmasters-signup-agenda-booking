// In getMemberNames.js
export async function getMemberNames(meetingDate, role) {
    const res = await fetch(`/api/getMemberNames?meetingDate=${meetingDate}&role=${role}`);
    const data = await res.json();
    return data;
}
