import { CloseOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
interface ModalFullscreenProps {
  children: React.ReactNode;
  onClose: () => void;
}

const ModalFullscreen = ({ children, onClose }: ModalFullscreenProps) => {
  return ReactDOM.createPortal(
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black bg-opacity-80 flex justify-center items-center p-4"
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          className="p-4 bg-white rounded-xl shadow-lg w-full h-full max-w-screen-2xl max-h-screen overflow-auto relative"
        >
          <Button
            className="absolute top-4 right-4 btn-danger"
            onClick={onClose}
            variant="solid"
            color="danger"
            size="small"
            icon={<CloseOutlined />}
          ></Button>
          <div className=" p-4 w-full h-full modal-content flex  items-center overflow-auto">
            <div className="p-4 w-full h-full min-w-[500px] flex justify-center items-center">
              {children}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default ModalFullscreen;
