import React from "react";
import SaveForm from "./SaveForm";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getFormApi } from "../../service/formService";
import Loading from "../../components/ui/Loading";

const UpdateForm = () => {
  const { id } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["form-detail", id],
    queryFn: () => getFormApi(id),
  });

  if (isLoading) {
    return <Loading></Loading>;
  }
  return <SaveForm data={data}></SaveForm>;
};

export default UpdateForm;
