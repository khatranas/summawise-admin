// components/FilterSection.jsx
export const FilterSection = ({
  title = "Bộ lọc",
  filters,
  onChange,
  onApply,
  onReset,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-10">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">{title}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {filters.map((filter, index) => {
          const commonProps = {
            name: filter.name,
            value: filter.value,
            onChange,
            className:
              "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryColor",
          };

          return (
            <div key={index}>
              <label className="block text-sm text-gray-600 mb-1">
                {filter.label}
              </label>

              {filter.type === "text" && (
                <input
                  type="text"
                  placeholder={filter.placeholder}
                  {...commonProps}
                />
              )}

              {filter.type === "date" && <input type="date" {...commonProps} />}

              {filter.type === "select" && (
                <select {...commonProps}>
                  {filter.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
          );
        })}

        {/* Nút hành động */}
        <div className="col-span-full flex flex-wrap gap-4 mt-2">
          <button
            onClick={onApply}
            className="bg-primaryColor text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
          >
            Áp dụng lọc
          </button>
          <button
            onClick={onReset}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition"
          >
            Xoá toàn bộ lọc
          </button>
        </div>
      </div>
    </div>
  );
};
