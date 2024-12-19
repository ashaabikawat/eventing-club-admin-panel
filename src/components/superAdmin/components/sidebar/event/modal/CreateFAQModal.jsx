import toast, { Toaster } from "react-hot-toast";
import { faqObjectSchema } from "../../../../validation/YupValidation";
import { useFormik } from "formik";
import { FaqEndPoint } from "../../../../../../services/apis";
import axios from "axios";
import { FaWindowClose } from "react-icons/fa";

const CreateFAQModal = ({ setShowCreateFaqModal, onNewFAQ }) => {
  const initialValues = {
    // faqTag: "",
    faqQuestion: "",
    faqAnswer: "",
  };

  // After Fill the Form Api Call
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    touched,
    handleBlur,
    setFieldValue,
    resetForm,
  } = useFormik({
    initialValues,
    validationSchema: faqObjectSchema,
    onSubmit: async (values) => {
      // const payload = {
      //   // Tag: values.faqTag,
      //   Question: values.faqQuestion,
      //   Answer: values.faqAnswer,
      // };

      handlerAddFAQ(values.faqQuestion, values.faqAnswer);

      // try {
      //   let response = await axios.post(
      //     `${FaqEndPoint.FAQ_CREATION_URL}`,
      //     payload
      //   );

      //   toast.success(response.data.message);
      //   onNewFAQ(response.data.data)
      //   resetForm();
      // } catch (error) {
      //   if (error.response) {
      //     const { status, data } = error.response;

      //     if (
      //       status === 404 ||
      //       status === 403 ||
      //       status === 500 ||
      //       status === 302 ||
      //       status === 409 ||
      //       status === 401 ||
      //       status === 400
      //     ) {
      //       console.log(error.response);
      //       toast.error(data.message);
      //     }
      //   }
      // }
    },
  });

  const handlerAddFAQ = (Question, Answer) => {
    const newFAQ = {
      id: Date.now() + Math.random().toString(36).substring(2, 9),
      Question,
      Answer,
    };
    onNewFAQ(newFAQ);
    resetForm();
    toast.success("FAQ successfully Created!");
    // setShowCreateFaqModal(false);
  };
  const handlerModal = () => {
    setShowCreateFaqModal(false);
  };

  const handlerSaveClick = () => {
    handleSubmit();
  };

  return (
    <div className="fixed top-0 left-0 w-full h-[100vh]  bg-black bg-opacity-30 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white p-4  rounded-md  w-[90%] md:w-[50%]">
        <div>
          <Toaster />
          <div className="w-[96%] flex justify-between">
            <p className="text-3xl pl-2 text-black font-bold mb-2">
              Create FAQ
            </p>

            <p
              onClick={() => handlerModal()}
              className="flex justify-center cursor-pointer items-center"
            >
              <FaWindowClose size={30} />
            </p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
          >
            <div>
              <div className="w-[96%] mt-[2%]">
                <div className="w-full grid gap-6 mb-6 md:grid-cols-2">
                  {/* FAQ  Tag */}
                  {/* <div className="md:col-span-2">
                  <label
                    htmlFor="name"
                    className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
                  >
                    FAQ Tag*
                  </label>
                  <input
                    type="text"
                    id="faqTag"
                    name="faqTag"
                    value={values.faqTag}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                  {errors.faqTag && touched.faqTag ? (
                    <p className="font-Marcellus text-start text-red-900">
                      {errors.faqTag}
                    </p>
                  ) : null}
                </div> */}

                  <div className="md:col-span-2">
                    <label
                      htmlFor="name"
                      className="block mb-2 text-start text-sm font-medium text-gray-900 "
                    >
                      Question*
                    </label>
                    <input
                      type="text"
                      id="faqQuestion"
                      name="faqQuestion"
                      value={values.faqQuestion}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    />
                    {errors.faqQuestion && touched.faqQuestion ? (
                      <p className="font-Marcellus text-start text-red-900">
                        {errors.faqQuestion}
                      </p>
                    ) : null}
                  </div>

                  {/* FAQ Answer */}
                  <div className="md:col-span-2 mb-4">
                    <label
                      htmlFor="faqAnswer"
                      className="block mb-2 text-start text-sm font-medium text-gray-900 "
                    >
                      Answer
                    </label>
                    <textarea
                      id="faqAnswer"
                      name="faqAnswer"
                      value={values.faqAnswer}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      rows={4}
                      className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 "
                    />
                    {errors.faqAnswer && touched.faqAnswer ? (
                      <p className="font-Marcellus text-start text-red-900">
                        {errors.faqAnswer}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="w-[96%] flex justify-end items-end ">
                <button
                  className="px-5 py-2 bg-strongBlue hover:bg-mildBlue text-white rounded-md"
                  type="button"
                  onClick={() => handlerSaveClick()}
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateFAQModal;
