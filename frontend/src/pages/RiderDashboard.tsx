import { useEffect, useState } from "react";
import { UseAppData } from "../context/AppContext";
import { useSocket } from "../context/SocketContext";
import axios from "axios";
import { riderService } from "../main";
import toast from "react-hot-toast";
import { BiUpload } from "react-icons/bi";

interface IRider {
    _id: string,
    phoneNumber: string;
    aadharNumber: string;
    drivingLicenseNumber: string;
    picture: string;
    isVerified: boolean;
    isAvailable: boolean;
}
const RiderDashboard = () => {

    const { user } = UseAppData();

    const { socket } = useSocket();

    const [profile, setProfile] = useState<IRider | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const [toggling, setToggling] = useState<boolean>(false);

    const fetchProfile = async () => {

        try {
            const { data } = await axios.get(`${riderService}/api/rider/myprofile`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
            });
            setProfile(data || null);


        } catch (error) {
            setProfile(null);


        } finally {
            setLoading(false);

        }
    }



    useEffect(() => {
        if (user?.role === "rider") fetchProfile();
        else setLoading(false);

    }, [user])

    const toggleAvailability = async () => {

    }
    if (!navigator.geolocation) {
        toast.error("location access required ");
        return;
    }


    setToggling(true)
    navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
            await axios.patch(`${riderService}/api/toggle`, {

                isAvailable: !profile?.isAvailable,
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
            });

            toast.success(profile?.isAvailable ? "Your are offline" : "Your are Online");
            fetchProfile();


        } catch (error: any) {
            toast.error(error.response.data.message)
        } finally {
            setToggling(false)
        }

    }

    );




    const [phoneNumber, setPhoneNumber] = useState("")
    const [drivingLicenseNumber, setDrivingLicenseNumber] = useState("")
    const [aadharNumber, setAadharNumber] = useState("")
    const [image, setImage] = useState<File | null>(null)
    const [submitting, setSubmitting] = useState(false)





    const handleSubmit = async () => {
        if (!navigator.geolocation) {
            toast.error("location access required ");
            return;
        }


        setLoading(true)
        navigator.geolocation.getCurrentPosition(async (pos) => {

            const FormData = new FromData();

            try {
                const { data } = await axios.post(
                    `${riderService}/api/new`, {

                    isAvailable: !profile?.isAvailable,
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")} `
                    },
                });

                toast.success(profile?.isAvailable ? "Your are offline" : "Your are Online");
                fetchProfile();


            } catch (error: any) {
                toast.error(error.response.data.message)
            } finally {
                setToggling(false)
            }

        }

        );


    }


    if (user?.role !== "rider") {
        return (
            <div className="flex min-h-[60vh] items-center justify-center text-gray-500">
                You are not a registered as a rider
            </div>

        )

    }


    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center text-gray-500">
                Loading rider details .....
            </div>

        )
    }
    if (!profile) {
        return (
            <div className="min-h-screen bg-gray-50 px-4 py-6">
                <div className="mx-auto max-w-2xl rounded-xl bg-white p-6 shadow-sm space-y-5">
                    <h1 className="text-xl font-semibold ">Add your  Profile</h1>
                    <input type="number"
                        placeholder="Aadhar number "
                        value={aadharNumber}
                        onChange={(e) => setAadharNumber(e.target.value)}
                        className="w-full rounded-lg border px-4 py-2 text-sm outline-none"
                    />
                    <input type="number"
                        placeholder="Phone Number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full rounded-lg border px-4 py-2 text-sm outline-none"
                    />
                    <input type="text"
                        placeholder="Driving License Number"
                        value={drivingLicenseNumber}
                        onChange={(e) => setDrivingLicenseNumber(e.target.value)}
                        className="w-full rounded-lg border px-4 py-2 text-sm outline-none"
                    />

                    <label className="flex  cursor-pointer items-center  gap-3 rounded-lg border p-4 
                text-sm text-gray-600 hover:bg-gray-50" >
                        <BiUpload className="h-5 w-5 text-red-500" />
                        {image ? image.name : "Upload your  image"}
                        <input type="file"
                            accept="image/*"
                            hidden
                            onChange={e => setImage(e.target.files?.[0] || null)} />
                    </label>


                    <button className="w-full rounded-lg py-3 text-sm 
                font-semibold text-white bg-[#E23744]"
                        onClick={handleSubmit}
                        disabled={submitting}>
                        {
                            submitting ? "submitting ..." : "Add profile "
                        }
                    </button>



                </div>
            </div>

        )
    }
    return (
        <div>RiderDashboard</div>
    )
}

export default RiderDashboard