import * as React from "react";

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {}

export const Table = ({ className = "", ...props }: TableProps) => (
  <div className="relative w-full overflow-auto">
    <table
      className={`w-full caption-bottom text-sm border-collapse ${className}`}
      {...props}
    />
  </div>
);

interface TableHeaderProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const TableHeader = ({ className = "", ...props }: TableHeaderProps) => (
  <thead className={`[&_tr]:border-b ${className}`} {...props} />
);

interface TableBodyProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const TableBody = ({ className = "", ...props }: TableBodyProps) => (
  <tbody className={`[&_tr:last-child]:border-0 ${className}`} {...props} />
);

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {}

export const TableRow = ({ className = "", ...props }: TableRowProps) => (
  <tr
    className={`border-b border-gray-200 transition-colors hover:bg-gray-50 data-[state=selected]:bg-gray-100 ${className}`}
    {...props}
  />
);

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {}

export const TableHead = ({ className = "", ...props }: TableHeadProps) => (
  <th
    className={`h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0 ${className}`}
    {...props}
  />
);

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {}

export const TableCell = ({ className = "", ...props }: TableCellProps) => (
  <td
    className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}
    {...props}
  />
);
