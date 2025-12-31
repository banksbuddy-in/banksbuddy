import { FaPhoneAlt } from "react-icons/fa";
import { IoMdPin } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Data = [
  {
    label: "Address",
    content: "Pan India Location",
    icon: <IoMdPin />,
    uri: "",
},
{
    label: "General Support",
    content: "banksbuddy2023@gmail.com",
    icon: <MdEmail />,
    uri: "",
},
{
    label: "Phone",
    content: "+91 63779 56633",
    icon: <FaPhoneAlt />,
    uri: "",
  },
];

export const ContactForm = () => {
    const navigate = useNavigate();
  return (
    <div id="contact">
      <div className="con1">
        {Data.map((i, k) => (
          <div className="contact-div" onClick={() => {navigate(i.uri)}} key={k}>
            <div className="contact-icon">{i.icon}</div>
            <div className="contactct">
              <h3>{i.label}</h3>
              <p>{i.content}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="con2"></div>
    </div>
  );
};
