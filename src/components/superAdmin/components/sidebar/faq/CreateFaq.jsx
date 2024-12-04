import toast, { Toaster } from "react-hot-toast";
import { faqObjectSchema } from "../../../validation/YupValidation";
import { useFormik } from "formik";
import { FaqEndPoint } from "../../../../../services/apis";
import axios from "axios";

const CreateFaq = () => {

   const initialValues = {
    faqTag: "",
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
      
      const payload = {
         Tag : values.faqTag,
         Question:values.faqQuestion,
         Answer:values.faqAnswer,
      }

      try {
        
        let response = await axios.post(
          `${FaqEndPoint.FAQ_CREATION_URL}`,
          payload
        );

        
          toast.success(response.data.message);
          resetForm();
        
      } catch (error) {
        if (error.response) {
          const { status, data } = error.response;

          if (
            status === 404 ||
            status === 403 ||
            status === 500 ||
            status === 302 ||
            status === 409 ||
            status === 401 ||
            status === 400
          ) {
            console.log(error.response);
            toast.error(data.message);
          }
        }
      }
    },
  });

  return (
     <div>
      <Toaster />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e);
        }}
      >
        <div>
          <div className="w-[70%] mt-[2%]">
            <div className="w-full grid gap-6 mb-6 md:grid-cols-2">
              {/* First Name Input Field  */}
              <div className="md:col-span-2">
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
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="name"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
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
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                  className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
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
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {errors.faqAnswer && touched.faqAnswer ? (
                  <p className="font-Marcellus text-start text-red-900">
                    {errors.faqAnswer}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

         <div className="w-[70%] flex justify-end items-end ">
            <button className="px-5 py-2 text-white bg-Gray40" type="submit ">
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default CreateFaq