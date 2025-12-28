import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useForm } from '@/context/FormContext';

const FormPage13: React.FC = () => {
  const { formData, updateFormData } = useForm();
  const pageData = formData.page13;

  const handleInputChange = (field: string, value: string) => {
    updateFormData('page13', { [field]: value });
  };

  const handleTableChange = (tableType: string, rowIndex: number, field: string, value: string) => {
    const updatedData = [...pageData[tableType]];
    if (!updatedData[rowIndex]) {
      updatedData[rowIndex] = {};
    }
    updatedData[rowIndex][field] = value;
    updateFormData('page13', { [tableType]: updatedData });
  };

  return (
    <div className="w-full max-w-full mx-auto p-1 sm:p-2 md:p-3 space-y-1 sm:space-y-2">
      <Card className="border-2 border-form-border bg-card p-1 sm:p-2 md:p-3">
        {/* Header */}
        <div className="text-center mb-1 sm:mb-2">
        <div className="flex items-center justify-between mb-1">
          <div className="flex-1 text-center">
            <div className="flex items-center justify-center mb-1">
              <div className="bg-red-500 text-white px-2 py-1 text-xs font-bold mr-2">SSIPL</div>
              <div className="text-lg font-bold">Shield Skills Institute</div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <img 
              src="/images/logo.png" 
              alt="Shield Skills Institute Logo" 
              className="object-contain"
              style={{ width: '87px', height: '73px' }}
            />
          </div>
        </div>
        </div>

        {/* Equipment Inspection Tables */}
        <div className="space-y-3">
          {/* Safety ropes, climbing semi-static - EN 1891 */}
          <div>
            <h4 className="font-bold mb-1 text-xs">Safety ropes, climbing semi-static - EN 1891</h4>
            <Table className="border border-gray-400 table-fixed w-full text-xs">
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="border border-gray-400 text-center font-bold w-8 py-1">No</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-12 py-1">ID No</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-12 py-1">Length</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-16 py-1">Wear, Cuts & Abrasions</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-16 py-1">Heat & Chemical Damage</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-16 py-1">Internal Damage & Discontinuities</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-12 py-1">Fraying</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-12 py-1">Heavy Soiling</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-12 py-1 leading-tight">Pass/<br/>Reject</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="border border-gray-400 text-center w-8 py-1">4</TableCell>
                  <TableCell className="border border-gray-400 p-1 w-12">
                    <Input
                      value={pageData.safetyRopesInspection[0]?.field0 || ''}
                      onChange={(e) => handleTableChange('safetyRopesInspection', 0, 'field0', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-1 w-12">
                    <Input
                      value={pageData.safetyRopesInspection[0]?.field1 || ''}
                      onChange={(e) => handleTableChange('safetyRopesInspection', 0, 'field1', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-1 w-16">
                    <Input
                      value={pageData.safetyRopesInspection[0]?.field2 || ''}
                      onChange={(e) => handleTableChange('safetyRopesInspection', 0, 'field2', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-1 w-16">
                    <Input
                      value={pageData.safetyRopesInspection[0]?.field3 || ''}
                      onChange={(e) => handleTableChange('safetyRopesInspection', 0, 'field3', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-1 w-16">
                    <Input
                      value={pageData.safetyRopesInspection[0]?.field4 || ''}
                      onChange={(e) => handleTableChange('safetyRopesInspection', 0, 'field4', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-1 w-12">
                    <Input
                      value={pageData.safetyRopesInspection[0]?.field5 || ''}
                      onChange={(e) => handleTableChange('safetyRopesInspection', 0, 'field5', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-1 w-12">
                    <Input
                      value={pageData.safetyRopesInspection[0]?.field6 || ''}
                      onChange={(e) => handleTableChange('safetyRopesInspection', 0, 'field6', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-1 w-12">
                      <Input
                      value={pageData.safetyRopesInspection[0]?.field7 || ''}
                      onChange={(e) => handleTableChange('safetyRopesInspection', 0, 'field7', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                      />
                    </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Shock Absorber - EN 355 */}
          <div>
            <h4 className="font-bold mb-1 text-xs">Shock Absorber - EN 355</h4>
            <Table className="border border-gray-400 table-fixed w-full text-xs">
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="border border-gray-400 text-center font-bold w-8 py-1">No</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-12 py-1">ID No</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-12 py-1">Serial No</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-16 py-1">Date of Manufacture</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-16 py-1">Stitching & Equipment</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-16 py-1">Protective Cover</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-12 py-1">Webbing</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-12 py-1">Connectors</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-12 py-1 leading-tight">Pass/<br/>Reject</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="border border-gray-400 text-center w-8 py-1">5</TableCell>
                  <TableCell className="border border-gray-400 p-1 w-12">
                    <Input
                      value={pageData.shockAbsorberInspection[0]?.field0 || ''}
                      onChange={(e) => handleTableChange('shockAbsorberInspection', 0, 'field0', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-1 w-12">
                    <Input
                      value={pageData.shockAbsorberInspection[0]?.field1 || ''}
                      onChange={(e) => handleTableChange('shockAbsorberInspection', 0, 'field1', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-1 w-16">
                    <Input
                      value={pageData.shockAbsorberInspection[0]?.field2 || ''}
                      onChange={(e) => handleTableChange('shockAbsorberInspection', 0, 'field2', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-1 w-16">
                    <Input
                      value={pageData.shockAbsorberInspection[0]?.field3 || ''}
                      onChange={(e) => handleTableChange('shockAbsorberInspection', 0, 'field3', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-1 w-16">
                    <Input
                      value={pageData.shockAbsorberInspection[0]?.field4 || ''}
                      onChange={(e) => handleTableChange('shockAbsorberInspection', 0, 'field4', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-1 w-12">
                    <Input
                      value={pageData.shockAbsorberInspection[0]?.field5 || ''}
                      onChange={(e) => handleTableChange('shockAbsorberInspection', 0, 'field5', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-1 w-12">
                    <Input
                      value={pageData.shockAbsorberInspection[0]?.field6 || ''}
                      onChange={(e) => handleTableChange('shockAbsorberInspection', 0, 'field6', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-1 w-12">
                      <Input
                      value={pageData.shockAbsorberInspection[0]?.field7 || ''}
                      onChange={(e) => handleTableChange('shockAbsorberInspection', 0, 'field7', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                      />
                    </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Connector - EN 362 */}
          <div>
            <h4 className="font-bold mb-1 text-xs">Connector - EN 362</h4>
            <Table className="border border-gray-400 table-fixed w-full text-xs">
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="border border-gray-400 text-center font-bold w-8 py-1">No</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-12 py-1">ID No</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-12 py-1">Body</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-16 py-1">Bolts & Rivets</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-16 py-1">Spring Action</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-12 py-1">Gate</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-16 py-1">Locking Sleeve</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-12 py-1">Rusting</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-12 py-1 leading-tight">Pass/<br/>Reject</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="border border-gray-400 text-center w-8 py-1">6</TableCell>
                  <TableCell className="border border-gray-400 p-1 w-12">
                    <Input
                      value={pageData.connectorInspection[0]?.field0 || ''}
                      onChange={(e) => handleTableChange('connectorInspection', 0, 'field0', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-1 w-12">
                    <Input
                      value={pageData.connectorInspection[0]?.field1 || ''}
                      onChange={(e) => handleTableChange('connectorInspection', 0, 'field1', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-1 w-16">
                    <Input
                      value={pageData.connectorInspection[0]?.field2 || ''}
                      onChange={(e) => handleTableChange('connectorInspection', 0, 'field2', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-1 w-16">
                    <Input
                      value={pageData.connectorInspection[0]?.field3 || ''}
                      onChange={(e) => handleTableChange('connectorInspection', 0, 'field3', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-1 w-12">
                    <Input
                      value={pageData.connectorInspection[0]?.field4 || ''}
                      onChange={(e) => handleTableChange('connectorInspection', 0, 'field4', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-1 w-16">
                    <Input
                      value={pageData.connectorInspection[0]?.field5 || ''}
                      onChange={(e) => handleTableChange('connectorInspection', 0, 'field5', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-1 w-12">
                    <Input
                      value={pageData.connectorInspection[0]?.field6 || ''}
                      onChange={(e) => handleTableChange('connectorInspection', 0, 'field6', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-1 w-12">
                      <Input
                      value={pageData.connectorInspection[0]?.field7 || ''}
                      onChange={(e) => handleTableChange('connectorInspection', 0, 'field7', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                      />
                    </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Double Locking Descending Device - EN 341 */}
          <div>
            <h4 className="font-bold mb-1 text-xs">Double Locking Descending Device - EN 341</h4>
            <Table className="border border-gray-400 table-fixed w-full text-xs">
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="border border-gray-400 text-center font-bold w-8 py-1">No</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-12 py-1">ID No</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-12 py-1">Body</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-16 py-1">Bolts & Rivets</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-12 py-1">Cams</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-16 py-1">Spring Action</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-16 py-1">Working Action</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-12 py-1">Deformed</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-12 py-1 leading-tight">Pass/<br/>Reject</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="border border-gray-400 text-center w-8 py-1">7</TableCell>
                  <TableCell className="border border-gray-400 p-1 w-12">
                    <Input
                      value={pageData.doubleLockingInspection[0]?.field0 || ''}
                      onChange={(e) => handleTableChange('doubleLockingInspection', 0, 'field0', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-1 w-12">
                    <Input
                      value={pageData.doubleLockingInspection[0]?.field1 || ''}
                      onChange={(e) => handleTableChange('doubleLockingInspection', 0, 'field1', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-1 w-16">
                    <Input
                      value={pageData.doubleLockingInspection[0]?.field2 || ''}
                      onChange={(e) => handleTableChange('doubleLockingInspection', 0, 'field2', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-1 w-12">
                    <Input
                      value={pageData.doubleLockingInspection[0]?.field3 || ''}
                      onChange={(e) => handleTableChange('doubleLockingInspection', 0, 'field3', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-1 w-16">
                    <Input
                      value={pageData.doubleLockingInspection[0]?.field4 || ''}
                      onChange={(e) => handleTableChange('doubleLockingInspection', 0, 'field4', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-1 w-16">
                    <Input
                      value={pageData.doubleLockingInspection[0]?.field5 || ''}
                      onChange={(e) => handleTableChange('doubleLockingInspection', 0, 'field5', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-1 w-12">
                    <Input
                      value={pageData.doubleLockingInspection[0]?.field6 || ''}
                      onChange={(e) => handleTableChange('doubleLockingInspection', 0, 'field6', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-1 w-12">
                      <Input
                      value={pageData.doubleLockingInspection[0]?.field7 || ''}
                      onChange={(e) => handleTableChange('doubleLockingInspection', 0, 'field7', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                      />
                    </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Fall Arrest Device (Rope Grab) - EN 567 */}
          <div>
            <h4 className="font-bold mb-1 text-xs">Fall Arrest Device (Rope Grab) - EN 567</h4>
            <Table className="border border-gray-400 table-fixed w-full text-xs">
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="border border-gray-400 text-center font-bold w-8 py-1">No</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-12 py-1">ID No</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-12 py-1">Body</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-16 py-1">Bolts & Rivets</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-12 py-1">Cams</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-16 py-1">Spring Action</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-16 py-1">Working Action</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-12 py-1">Rusting</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-12 py-1 leading-tight">Pass/<br/>Reject</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="border border-gray-400 text-center w-8 py-1">8</TableCell>
                  <TableCell className="border border-gray-400 p-1 w-12">
                    <Input
                      value={pageData.fallArrestDeviceInspection[0]?.field0 || ''}
                      onChange={(e) => handleTableChange('fallArrestDeviceInspection', 0, 'field0', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-1 w-12">
                    <Input
                      value={pageData.fallArrestDeviceInspection[0]?.field1 || ''}
                      onChange={(e) => handleTableChange('fallArrestDeviceInspection', 0, 'field1', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-1 w-16">
                    <Input
                      value={pageData.fallArrestDeviceInspection[0]?.field2 || ''}
                      onChange={(e) => handleTableChange('fallArrestDeviceInspection', 0, 'field2', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-1 w-12">
                    <Input
                      value={pageData.fallArrestDeviceInspection[0]?.field3 || ''}
                      onChange={(e) => handleTableChange('fallArrestDeviceInspection', 0, 'field3', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-1 w-16">
                    <Input
                      value={pageData.fallArrestDeviceInspection[0]?.field4 || ''}
                      onChange={(e) => handleTableChange('fallArrestDeviceInspection', 0, 'field4', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-1 w-16">
                    <Input
                      value={pageData.fallArrestDeviceInspection[0]?.field5 || ''}
                      onChange={(e) => handleTableChange('fallArrestDeviceInspection', 0, 'field5', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-1 w-12">
                    <Input
                      value={pageData.fallArrestDeviceInspection[0]?.field6 || ''}
                      onChange={(e) => handleTableChange('fallArrestDeviceInspection', 0, 'field6', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-1 w-12">
                      <Input
                      value={pageData.fallArrestDeviceInspection[0]?.field7 || ''}
                      onChange={(e) => handleTableChange('fallArrestDeviceInspection', 0, 'field7', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                      />
                    </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Work Positioning Belt - EN 358 */}
          <div>
            <h4 className="font-bold mb-1 text-xs">Work Positioning Belt - EN 358</h4>
            <Table className="border border-gray-400 table-fixed w-full text-xs">
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="border border-gray-400 text-center font-bold w-8 py-1">No</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-12 py-1">ID No</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-12 py-1">Serial No</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-16 py-1">Date of Manufacture</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-12 py-1">Stitching</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-16 py-1">Buckles/Length Adjuster</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-12 py-1">Webbing</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-12 py-1">Connectors</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-12 py-1 leading-tight">Pass/<br/>Reject</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="border border-gray-400 text-center w-8 py-1">9</TableCell>
                  <TableCell className="border border-gray-400 p-1 w-12">
                    <Input
                      value={pageData.workPositioningInspection[0]?.field0 || ''}
                      onChange={(e) => handleTableChange('workPositioningInspection', 0, 'field0', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-1 w-12">
                    <Input
                      value={pageData.workPositioningInspection[0]?.field1 || ''}
                      onChange={(e) => handleTableChange('workPositioningInspection', 0, 'field1', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-1 w-16">
                    <Input
                      value={pageData.workPositioningInspection[0]?.field2 || ''}
                      onChange={(e) => handleTableChange('workPositioningInspection', 0, 'field2', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-1 w-12">
                    <Input
                      value={pageData.workPositioningInspection[0]?.field3 || ''}
                      onChange={(e) => handleTableChange('workPositioningInspection', 0, 'field3', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-1 w-16">
                    <Input
                      value={pageData.workPositioningInspection[0]?.field4 || ''}
                      onChange={(e) => handleTableChange('workPositioningInspection', 0, 'field4', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-1 w-12">
                    <Input
                      value={pageData.workPositioningInspection[0]?.field5 || ''}
                      onChange={(e) => handleTableChange('workPositioningInspection', 0, 'field5', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-1 w-12">
                    <Input
                      value={pageData.workPositioningInspection[0]?.field6 || ''}
                      onChange={(e) => handleTableChange('workPositioningInspection', 0, 'field6', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-1 w-12">
                      <Input
                      value={pageData.workPositioningInspection[0]?.field7 || ''}
                      onChange={(e) => handleTableChange('workPositioningInspection', 0, 'field7', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                      />
                    </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Task Assessment Tables */}
        <div className="space-y-3 mt-4">
          <div>
            <h4 className="font-bold mb-1 text-xs">Task 2 (Total marks - 03)</h4>
            <p className="text-xs mb-1">Prepare for practical task at height</p>
            
            <Table className="border border-gray-400 table-fixed w-full text-xs">
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="border border-gray-400 text-center font-bold w-48 py-1">Subtask for Assessment Observation</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-8 py-1">A</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-8 py-1">N/A</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-32 py-1">Assessors notes & comments</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="border border-gray-400 p-1 w-48 text-xs">Full range of fall arrest equipment required for all climbing tasks are identified, inspected and the inspection criteria explained</TableCell>
                  <TableCell className="border border-gray-400 p-1 w-8">
                    <Input
                      value={pageData.task2Results[0]?.a || ''}
                      onChange={(e) => handleTableChange('task2Results', 0, 'a', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-1 w-8">
                    <Input
                      value={pageData.task2Results[0]?.na || ''}
                      onChange={(e) => handleTableChange('task2Results', 0, 'na', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-1 w-32">
                    <Input
                      value={pageData.task2Results[0]?.comments || ''}
                      onChange={(e) => handleTableChange('task2Results', 0, 'comments', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="border border-gray-400 p-1 w-48 text-xs">Personal fall arrest equipment and personal Protective Equipment (PPE) is assembled and fitted according to manufacturer specification</TableCell>
                  <TableCell className="border border-gray-400 p-1 w-8">
                    <Input
                      value={pageData.task2Results[1]?.a || ''}
                      onChange={(e) => handleTableChange('task2Results', 1, 'a', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-1 w-8">
                    <Input
                      value={pageData.task2Results[1]?.na || ''}
                      onChange={(e) => handleTableChange('task2Results', 1, 'na', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-1 w-32">
                    <Input
                      value={pageData.task2Results[1]?.comments || ''}
                      onChange={(e) => handleTableChange('task2Results', 1, 'comments', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="border border-gray-400 p-1 w-48 text-xs">Full range of rescue equipment is identified and inspected</TableCell>
                  <TableCell className="border border-gray-400 p-1 w-8">
                    <Input
                      value={pageData.task2Results[2]?.a || ''}
                      onChange={(e) => handleTableChange('task2Results', 2, 'a', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-1 w-8">
                    <Input
                      value={pageData.task2Results[2]?.na || ''}
                      onChange={(e) => handleTableChange('task2Results', 2, 'na', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-1 w-32">
                    <Input
                      value={pageData.task2Results[2]?.comments || ''}
                      onChange={(e) => handleTableChange('task2Results', 2, 'comments', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div>
            <h4 className="font-bold mb-1 text-xs">Task 3 (Total marks - 08)</h4>
            <p className="text-xs mb-1">Installation and application of fall arrest systems. The use of the full range of required equipment are explained throughout practical use</p>
            
            <Table className="border border-gray-400 table-fixed w-full text-xs">
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="border border-gray-400 text-center font-bold w-48 py-1">Subtask for Assessment Observation</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-8 py-1">A</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-8 py-1">N/A</TableHead>
                  <TableHead className="border border-gray-400 text-center font-bold w-32 py-1">Assessors notes & comments</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="border border-gray-400 p-1 w-48 text-xs">Installation of vertical and horizontal life line. Includes safe use of anchor points. Limited free space is managed</TableCell>
                  <TableCell className="border border-gray-400 p-1 w-8">
                    <Input
                      value={pageData.task3Results[0]?.a || ''}
                      onChange={(e) => handleTableChange('task3Results', 0, 'a', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-1 w-8">
                    <Input
                      value={pageData.task3Results[0]?.na || ''}
                      onChange={(e) => handleTableChange('task3Results', 0, 'na', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="border border-gray-400 p-1 w-32">
                    <Input
                      value={pageData.task3Results[0]?.comments || ''}
                      onChange={(e) => handleTableChange('task3Results', 0, 'comments', e.target.value)}
                      className="border-0 bg-transparent text-xs w-full overflow-hidden"
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="mt-4">
            <div className="border-2 border-form-border p-4">
              <Label className="text-sm font-semibold mb-2 block">Learner Signature</Label>
            </div>
            <div className="border-b border-form-border mt-4"></div>
          </div>
          
          <div className="mt-4">
            <div className="border-2 border-form-border p-4">
              <Label className="text-sm font-semibold mb-2 block">Assessor / Facilitator Signature</Label>
            </div>
            <div className="border-b border-form-border mt-4"></div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center">
          <div className="text-sm font-bold">FALL ARREST & RESCUE MANAGEMENT - ToClf</div>
          <div className="text-xs text-muted-foreground mt-1 flex justify-end">
            <span>Page | 13</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FormPage13;