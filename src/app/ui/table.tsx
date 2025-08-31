import * as React from "react";

type TableProps = React.ComponentPropsWithoutRef<"table">;
export const Table = ({ className = "", ...props }: TableProps) => (
  <div className="relative w-full overflow-auto">
    <table
      className={`w-full caption-bottom text-sm border-collapse ${className}`}
      {...props}
    />
  </div>
);

type TableHeaderProps = React.ComponentPropsWithoutRef<"thead">;
export const TableHeader = ({ className = "", ...props }: TableHeaderProps) => (
  <thead className={`[&_tr]:border-b ${className}`} {...props} />
);

type TableBodyProps = React.ComponentPropsWithoutRef<"tbody">;
export const TableBody = ({ className = "", ...props }: TableBodyProps) => (
  <tbody className={`[&_tr:last-child]:border-0 ${className}`} {...props} />
);

type TableRowProps = React.ComponentPropsWithoutRef<"tr">;
export const TableRow = ({ className = "", ...props }: TableRowProps) => (
  <tr
    className={`border-b border-gray-200 transition-colors hover:bg-gray-50 data-[state=selected]:bg-gray-100 ${className}`}
    {...props}
  />
);

type TableHeadProps = React.ComponentPropsWithoutRef<"th">;
export const TableHead = ({ className = "", ...props }: TableHeadProps) => (
  <th
    className={`h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0 ${className}`}
    {...props}
  />
);

type TableCellProps = React.ComponentPropsWithoutRef<"td">;
export const TableCell = ({ className = "", ...props }: TableCellProps) => (
  <td
    className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}
    {...props}
  />
);
