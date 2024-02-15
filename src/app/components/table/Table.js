"use client";
import { useEffect, useState } from "react";
import "./Table.css";
import CaretBottom from "./icon/CaretBottom";

const apiUsers = "https://dummyjson.com/users";

export default function Table() {
  const [users, setUsers] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  console.log(users)

  const [sort, setSort] = useState({
    keyToSort: "FULL NAME",
    direction: "asc",
  });

  const formatFullName = (user) => {
    return `${user.firstName} ${user.lastName} ${user.maidenName}`;
  };

  const getUsers = async (url) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      const formattedData = data.users.map((user) => ({
        ...user,
        fullName: formatFullName(user),
        address: `${user.address.address}, ${user.address.city}`,
      }));
      setUsers(formattedData);
    } catch (error) {
      console.error(error);
    }
  };

  const filterUsers = async (filterKey, filterValue) => {
    const url = `https://dummyjson.com/users/filter?key=${filterKey}&value=${filterValue}`;
    getUsers(url);
  };

  useEffect(() => {
    getUsers(apiUsers);
  }, []);

  const headers = [
    {
      id: 1,
      key: "fullName",
      label: "FULL NAME",
    },
    {
      id: 2,
      key: "age",
      label: "AGE",
    },
    {
      id: 3,
      key: "gender",
      label: "GENDER",
    },
    {
      id: 4,
      key: "phone",
      label: "PHONE",
    },
    {
      id: 5,
      key: "address",
      label: "ADDRESS",
    },
  ];

  const handleCkickSort = (header) => {
    console.log(header);
    setSort({
      keyToSort: header.key,
      direction:
        header.key === sort.keyToSort
          ? sort.direction === "asc"
            ? "desc"
            : "asc"
          : "desc",
    });
  };

  const getSortered = (array) => {
    if (sort.direction === "asc") {
      return array.sort((a, b) =>
        a[sort.keyToSort] > b[sort.keyToSort] ? 1 : -1
      );
    } else {
      return array.sort((a, b) =>
        a[sort.keyToSort] > b[sort.keyToSort] ? -1 : 1
      );
    }
  };

  const handleFilter = (event) => {
    setFilterValue(event.target.value);
  };

  return (
    <>
      <div className="form__components">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const filterKeys = [
              "firstName",
              "lastName",
              "maidenName",
              "age",
              "gender",
              "phone",
              "address.address",
              "address.city",
            ];
            filterKeys.forEach((filterKey) => {
              filterUsers(filterKey, filterValue);
            });
          }}
        >
          <input type="text" value={filterValue} onChange={handleFilter} />
          <button type="submit">Filter</button>
        </form>
      </div>
      <div className="table__components">
        <table>
          <thead>
            <tr>
              {headers.map((header, i) => (
                <th key={i} onClick={() => handleCkickSort(header)}>
                  <span>{header.label}</span>
                  <span>
                    <CaretBottom
                      direction={
                        sort.keyToSort === header.key ? sort.direction : "asc"
                      }
                    />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {getSortered(users).map((user, index) => (
              <tr key={index}>
                {headers.map((header, index) => (
                  <td title={user[header.key]} key={index}>
                    {user[header.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
