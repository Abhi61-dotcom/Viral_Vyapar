import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import WhatsAppFloatingBtn from '../components/Common/WhatsAppFloatingBtn';
import ROICalculatorModal from '../components/Common/ROICalculatorModal';
import ConsultationModal from '../components/Common/ConsultationModal';
import LeadCaptureModal from '../components/Common/LeadCaptureModal';
import { trackPageView } from '../utils/api';

const MainLayout = () => {
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [consultationData, setConsultationData] = useState({});
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    trackPageView(location.pathname);
  }, [location.pathname]);

  const handleOpenConsultation = (data = {}) => {
    setConsultationData(data);
    setIsConsultationOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#050816] text-slate-100 font-body flex flex-col justify-between selection:bg-amber-500 selection:text-black">
      <Navbar
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onOpenConsultation={() => handleOpenConsultation()}
      />

      <main className="flex-grow pt-24">
        <Outlet context={{
          openCalculator: () => setIsCalculatorOpen(true),
          openConsultation: (data) => handleOpenConsultation(data)
        }} />
      </main>

      <Footer onOpenConsultation={() => handleOpenConsultation()} />

      <WhatsAppFloatingBtn onOpenConsultation={() => handleOpenConsultation()} />

      <ROICalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        onOpenConsultation={(data) => handleOpenConsultation(data)}
      />

      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
        initialData={consultationData}
      />

      <LeadCaptureModal />
    </div>
  );
};

export default MainLayout;